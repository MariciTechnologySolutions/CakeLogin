<?php
require('fpdf.php');
	//  Define variable
	$info=array();
	$info['seller']='';;
	$info['premises_address']='';
	$info['date']='';
	
	$info['hoa']='';
	$info['hoa_contact_info']='';
	$info['hoa_management_company']='';
	$info['hoa_management_company_contact_info']='';
	$info['hoa_amount_of_dues']='';
	$info['hoa_dues_how_often']='';
	$info['hoa_amount_asseessment']='';
	$info['hoa_amount_asseessment_often']='';
	$info['hoa_amount_asseessment_start_date']='';
	$info['hoa_amount_asseessment_often_end_date']='';
	
	$info['master_app']='';
	$info['master_app_contact_info']='';
	$info['master_app_management_company']='';
	$info['master_app_management_company_contact_info']='';
	$info['master_app_amount_of_dues']='';
	$info['master_app_dues_how_often']='';
	$info['master_app_amount_asseessment']='';
	$info['master_app_amount_asseessment_often']='';
	$info['master_app_amount_asseessment_start_date']='';
	$info['master_app_amount_asseessment_often_end_date']='';
	
	$info['other_app']='';
	$info['other_app_contact_info']='';
	$info['other_app_amount_of_dues']='';
	$info['other_app_dues_how_often']='';
	
	$info['transfer_fees_hoa']='';
	$info['transfer_fees_homaster_app']='';
	$info['improvment_fees_hoa']='';
	$info['improvment_fees_homaster_app']='';
	$info['prepaid_fees_hoa']='';
	$info['prepaid_fees_homaster_app']='';
	$info['disclosure_fees_hoa']='';
	$info['disclosure_fees_homaster_app']='';
	$info['other_fees']='';
	$info['other_explain']='';
	
	$info['seller_signiture']='';
	$info['seller_signiture_date']='';
	
	$info['ack_seller_name']='';
	$info['ack_buyer_name']='';
	$info['ack_premises_address']='';
	$info['ack_date']='';
	$info['transfer_fees_other']='';
	$info['improvment_fees_other']='';
	$info['ack_other_fees']='';
	
	$info['buyers_signiture']='';
	$info['buyers_signiture_date']='';
	$info['brokerage_file']='';
	$info['managers_initials']='';
	$info['brokers_initials']='';
	$info['brokers_date']='';
	
class PDF extends FPDF
{
var $B;
var $I;
var $U;
var $HREF;

function PDF($orientation='P', $unit='mm', $size='A4')
{
    // Call parent constructor
    $this->FPDF($orientation,$unit,$size);
    // Initialization
    $this->B = 0;
    $this->I = 0;
    $this->U = 0;
    $this->HREF = '';
}

function WriteHTML($html)
{
    // HTML parser
    $html = str_replace("\n",' ',$html);
    $a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
    foreach($a as $i=>$e)
    {
        if($i%2==0)
        {
            // Text
            if($this->HREF)
                $this->PutLink($this->HREF,$e);
            else
                $this->Write(5,$e);
        }
        else
        {
            // Tag
            if($e[0]=='/')
                $this->CloseTag(strtoupper(substr($e,1)));
            else
            {
                // Extract attributes
                $a2 = explode(' ',$e);
                $tag = strtoupper(array_shift($a2));
                $attr = array();
                foreach($a2 as $v)
                {
                    if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                        $attr[strtoupper($a3[1])] = $a3[2];
                }
                $this->OpenTag($tag,$attr);
            }
        }
    }
}

function OpenTag($tag, $attr)
{
    // Opening tag
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,true);
    if($tag=='A')
        $this->HREF = $attr['HREF'];
    if($tag=='BR')
        $this->Ln(5);
}

function CloseTag($tag)
{
    // Closing tag
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,false);
    if($tag=='A')
        $this->HREF = '';
}

function SetStyle($tag, $enable)
{
    // Modify style and select corresponding font
    $this->$tag += ($enable ? 1 : -1);
    $style = '';
    foreach(array('B', 'I', 'U') as $s)
    {
        if($this->$s>0)
            $style .= $s;
    }
    $this->SetFont('',$style);
}

function PutLink($URL, $txt)
{
    // Put a hyperlink
    $this->SetTextColor(0,0,255);
    $this->SetStyle('U',true);
    $this->Write(5,$txt,$URL);
    $this->SetStyle('U',false);
    $this->SetTextColor(0);
}


//Cell with horizontal scaling if text is too wide
	function CellFit($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='', $scale=false, $force=true)
	{
		//Get string width
		$str_width=$this->GetStringWidth($txt);

		//Calculate ratio to fit cell
		if($w==0)
			$w = $this->w-$this->rMargin-$this->x;
		$ratio = ($w-$this->cMargin*2)/$str_width;

		$fit = ($ratio < 1 || ($ratio > 1 && $force));
		if ($fit)
		{
			if ($scale)
			{
				//Calculate horizontal scaling
				$horiz_scale=$ratio*100.0;
				//Set horizontal scaling
				$this->_out(sprintf('BT %.2F Tz ET',$horiz_scale));
			}
			else
			{
				//Calculate character spacing in points
				$char_space=($w-$this->cMargin*2-$str_width)/max($this->MBGetStringLength($txt)-1,1)*$this->k;
				//Set character spacing
				$this->_out(sprintf('BT %.2F Tc ET',$char_space));
			}
			//Override user alignment (since text will fill up cell)
			$align='';
		}

		//Pass on to Cell method
		$this->Cell($w,$h,$txt,$border,$ln,$align,$fill,$link);

		//Reset character spacing/horizontal scaling
		if ($fit)
			$this->_out('BT '.($scale ? '100 Tz' : '0 Tc').' ET');
	}

	//Cell with horizontal scaling only if necessary
	function CellFitScale($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,false);
	}

	//Cell with horizontal scaling always
	function CellFitScaleForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,true);
	}

	//Cell with character spacing only if necessary
	function CellFitSpace($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,false);
	}

	//Cell with character spacing always
	function CellFitSpaceForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		//Same as calling CellFit directly
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,true);
	}

	//Patch to also work with CJK double-byte text
	function MBGetStringLength($s)
	{
		if($this->CurrentFont['type']=='Type0')
		{
			$len = 0;
			$nbbytes = strlen($s);
			for ($i = 0; $i < $nbbytes; $i++)
			{
				if (ord($s[$i])<128)
					$len++;
				else
				{
					$len++;
					$i++;
				}
			}
			return $len;
		}
		else
			return strlen($s);
	}





//  Code for creating pdf

// Page header
function Header()
{
	if($this->PageNo() == 1){
		$this->SetFont('Arial','B',16);
		$this->Cell(0,1,'H.O.A. CONDOMINIUM /',0,1,'L');
		$this->Cell(100,12,'PLANNED COMMUNITY ADDENDUM',0,0,'L');
		$this->SetFont('Arial','B',10);
		$this->SetX(170);
		$this->Cell(0,4,'Page '.$this->PageNo().' of {nb}','',0,'C');
		$this->Ln();
		$this->SetX(170);
		$this->Cell(0,8,'February 2015','',1,'C');
		
		$this->Cell(50,20,$this->Image('images/arizona_left_color.jpg',10, $this->GetY()+3,50,15),'1',0,'C');
		$this->SetFont('Arial','I',7);
		
		$this->MultiCell(110,4,utf8_decode("The pre-printed portion of this form has been drafted by the Arizona Association of REALTORS®. Any change in the pre-printed language of this form must be made in a prominent manner.
		No representations are made as to the legal validity, adequacy and/or effects of any provision,
		including tax consequences thereof. If you desire legal, tax or other professional advice, please consult your attorney, tax advisor or professional consultant."),'1','L');
		$this->SetY(23);
		$this->SetX(170);
		$this->Cell(30,20,$this->Image('images/arizona_right.png',172, $this->GetY()+3,25,15),'1',1,'C');
    }
}

// Page footer
function Footer()
{	
	global $info;
	$str1=utf8_decode('H.O.A. Condominium / Planned Community Addendum . February 2015 Copyright . 2015 Arizona Association of REALTORS®. All rights reserved.');
	$str2=utf8_decode('Produced with zipForm® by zipLogix  18070 Fifteen Mile Road, Fraser, Michigan 48026   ');
	if($this->PageNo() == 1){
		$this->SetFont('Arial','',8);
		$this->Cell(25,5,'','',1,'');
		$this->Cell(200,1,'','B',1,'');  	
		$this->Cell(200,5,$str1,'',1,'C'); 
		$this->Cell(200,3,'','T',1,''); 
		$this->Cell(200,3,'Page '.$this->PageNo().' of {nb}','',1,'C'); 
		$this->Cell(25,5,'','',1,'');
		$this->Cell(100,3,'Presidential Realty, 4856 E Baseline Rd #106 Mesa, AZ 85206','',1,'L'); 	
		$this->Cell(40,5,'Phone: 480-235-1400','',0,'');
		$this->Cell(30,5,"Fax: 480-212-5464",'',0,'');
		$this->Cell(30,5,"Steve Peterson",'',0,'');
		$this->Cell(30,5,"delete",'',1,'');
		$this->Cell(120,5,$str2,0,0,'C');
		$this->Cell(30,5,' www.zipLogix.com',0,0,'','','https://zipLogix.com');
		$this->Ln();
		$this->Image('images/footer_qr_code.png',$this->GetX()+175,$this->GetY()-10,15,0);
		$this->Ln();
    }
	if($this->PageNo() != 1){
		$this->SetFont('Arial','',6);
		$this->Cell(25,5,'','',1,'');
		$this->Cell(200,1,'','B',1,'');  	
		$this->Cell(200,5,$str1,'',1,'C'); 
		$this->Cell(200,3,'','T',1,''); 
		$this->Cell(200,3,'Page '.$this->PageNo().' of {nb}','',1,'C'); 
		$this->Cell(100,5,$str2,0,0,'R');
		$this->Cell(30,5,' www.zipLogix.com',0,0,'','','https://zipLogix.com');
		$this->Cell(10,5,"delete",'',1,'');
		
		$this->Image('images/footer_qr_code.png',$this->GetX()+175,$this->GetY()-5,15,0);
		$this->Ln();
    }

	
}




}

$pdf = new PDF('P','mm',array(215,335));
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->Ln(3);

//text
$pdf->SetFont('Arial','B',10);
$pdf->Cell(205,4,"SELLER'S NOTICE OF H.O.A. INFORMATION",'',1,'C');

$pdf->SetLineWidth('1');
$pdf->SetDrawColor(0,0,0);
$pdf->Line(12,$pdf->GetY(),205,$pdf->GetY());
$pdf->SetLineWidth('');
$pdf->Ln(3);

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'1.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(10,4,"Seller:  ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(178,4,$info['seller'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'2.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(25,4,"Premises Address:  ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(163,4,$info['premises_address'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'3.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(10,4,"Date:  ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(178,4,$info['date'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');
	
$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'4.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(23,5,"INSTRUCTIONS:",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,utf8_decode("(1) Homeowner's association ('H.O.A.') information to be completed by Seller at the time of listing the Premises for sale."),'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'5.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"(2) Upon completion, this Addendum shall be uploaded to the multiple listing service, if available, or delivered to prospective buyers upon ",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'6.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"request prior to prospective buyer's submission of a Purchase Contract to Seller.",'',1,'');
$pdf->Cell(200,3,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'7.','',0,'');
$pdf->SetFont('Arial','B',10);
$pdf->Cell(0,5,"ASSOCIATION(S) GOVERNING THE PREMISES",'',1,'C');

/*ASSOCIATION(S) GOVERNING THE PREMISES HOA*/
// LINE
$pdf->Line(16,$pdf->GetY(),190,$pdf->GetY());
$pdf->Line(16,$pdf->GetY()+24,190,$pdf->GetY()+24);
$pdf->Line(16,$pdf->GetY(),16,$pdf->GetY()+24);
$pdf->Line(190,$pdf->GetY(),190,$pdf->GetY()+24);

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'8.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(10,5,"H.O.A.:",'',0,'C');
$pdf->SetFont('Arial','',8);
$pdf->Cell(70,5,$info['hoa'],'B',0,'C');
$pdf->Cell(20,5,"Contact info:",'',0,'C');
$pdf->SetFont('Arial','',8);
$pdf->Cell(70,5,$info['hoa_contact_info'],'B',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'9.','',0,'');
$pdf->Cell(40,5,"Management Company (if any):",'',0,'C');
$pdf->Cell(40,5,$info['hoa_management_company'],'B',0,'C');
$pdf->Cell(15,5,"Contact info:",'',0,'C');
$pdf->Cell(70,5,$info['hoa_management_company_contact_info'],'B',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'10.','',0,'');
$pdf->Cell(25,5,"Amount of Dues:  $:",'',0,'C');
$pdf->Cell(20,5,$info['hoa_amount_of_dues'],'B',0,'C');
$pdf->Cell(15,5,"How often?:",'',0,'C');
$pdf->Cell(20,5,$info['hoa_dues_how_often'],'B',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'11.','',0,'');
$pdf->Cell(52,5,"Amount of special assessments (if any):  $:",'',0,'C');
$pdf->Cell(15,5,$info['hoa_amount_asseessment'],'B',0,'C');
$pdf->Cell(15,5,"How often?:",'',0,'C');
$pdf->Cell(15,5,$info['hoa_amount_asseessment_often'],'B',0,'C');
$pdf->Cell(15,5,"Start Date:",'',0,'C');
$pdf->Cell(20,5,$info['hoa_amount_asseessment_start_date'],'B',0,'C');
$pdf->Cell(15,5,"End Date: ",'',0,'C');
$pdf->Cell(20,5,$info['hoa_amount_asseessment_often_end_date'],'B',1,'C');

$pdf->SetFont('Arial','',6);
$pdf->Cell(140,3,'MO/DA/YR','',0,'R');
$pdf->Cell(35,3,'MO/DA/YR','',1,'C');

/*ASSOCIATION(S) GOVERNING THE PREMISES application*/
$pdf->Cell(200,3,'','',1,'');
// LINE
$pdf->Line(16,$pdf->GetY(),190,$pdf->GetY());
$pdf->Line(16,$pdf->GetY()+24,190,$pdf->GetY()+24);
$pdf->Line(16,$pdf->GetY(),16,$pdf->GetY()+24);
$pdf->Line(190,$pdf->GetY(),190,$pdf->GetY()+24);
// LINE
$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'12.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(35,5,"Master Association (if any):",'',0,'C');
$pdf->SetFont('Arial','',8);
$pdf->Cell(40,5,$info['master_app'],'B',0,'C');
$pdf->Cell(20,5,"Contact info:",'',0,'C');
$pdf->SetFont('Arial','',8);
$pdf->Cell(70,5,$info['master_app_contact_info'],'B',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'13.','',0,'');
$pdf->Cell(40,5,"Management Company (if any):",'',0,'C');
$pdf->Cell(40,5,$info['master_app_management_company'],'B',0,'C');
$pdf->Cell(15,5,"Contact info:",'',0,'C');
$pdf->Cell(70,5,$info['master_app_management_company_contact_info'],'B',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'14.','',0,'');
$pdf->Cell(25,5,"Amount of Dues:  $:",'',0,'C');
$pdf->Cell(20,5,$info['master_app_amount_of_dues'],'B',0,'C');
$pdf->Cell(15,5,"How often?:",'',0,'C');
$pdf->Cell(20,5,$info['master_app_dues_how_often'],'B',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'15.','',0,'');
$pdf->Cell(52,5,"Amount of special assessments (if any):  $:",'',0,'C');
$pdf->Cell(15,5,$info['master_app_amount_asseessment'],'B',0,'C');
$pdf->Cell(15,5,"How often?:",'',0,'C');
$pdf->Cell(15,5,$info['master_app_amount_asseessment_often'],'B',0,'C');
$pdf->Cell(15,5,"Start Date:",'',0,'C');
$pdf->Cell(20,5,$info['master_app_amount_asseessment_start_date'],'B',0,'C');
$pdf->Cell(15,5,"End Date: ",'',0,'C');
$pdf->Cell(20,5,$info['master_app_amount_asseessment_often_end_date'],'B',1,'C');

$pdf->SetFont('Arial','',6);
$pdf->Cell(140,3,'MO/DA/YR','',0,'R');
$pdf->Cell(35,3,'MO/DA/YR','',1,'C');
/*ASSOCIATION(S) GOVERNING THE PREMISES application*/
$pdf->Cell(200,3,'','',1,'');
$pdf->Line(16,$pdf->GetY(),190,$pdf->GetY());
$pdf->Line(16,$pdf->GetY()+12,190,$pdf->GetY()+12);
$pdf->Line(16,$pdf->GetY(),16,$pdf->GetY()+12);
$pdf->Line(190,$pdf->GetY(),190,$pdf->GetY()+12);

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'16.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(10,5,"Other:",'',0,'C');
$pdf->SetFont('Arial','',8);
$pdf->Cell(70,5,$info['other_app'],'B',0,'C');
$pdf->Cell(20,5,"Contact info:",'',0,'C');
$pdf->SetFont('Arial','',8);
$pdf->Cell(70,5,$info['other_app_contact_info'],'B',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'17.','',0,'');
$pdf->Cell(25,5,"Amount of Dues:  $:",'',0,'C');
$pdf->Cell(20,5,$info['other_app_amount_of_dues'],'B',0,'C');
$pdf->Cell(15,5,"How often?:",'',0,'C');
$pdf->Cell(20,5,$info['other_app_dues_how_often'],'B',1,'C');

$pdf->Cell(200,3,'','',1,'');
//other

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'18.','',0,'');
$pdf->SetFont('Arial','B',10);
$pdf->Cell(0,5,"FEES PAYABLE UPON CLOSE OF ESCROW ",'',1,'C');
$pdf->SetLineWidth('1');
$pdf->SetDrawColor(0,0,0);
$pdf->Line(12,$pdf->GetY(),205,$pdf->GetY());
$pdf->SetLineWidth('');
$pdf->Ln(3);
$pdf->Cell(200,3,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'19.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(20,5,'Transfer Fees: ','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(80,5,'Association(s) fees related to the transfer of title. H.O.A. $','',0,'');
$pdf->Cell(25,5,$info['transfer_fees_hoa'],'B',0,'');
$pdf->Cell(30,5,'Master Association $','',0,'');
$pdf->Cell(25,5,$info['transfer_fees_homaster_app'],'B',1,'');
$pdf->Cell(200,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'20.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(38,5,'Capital Improvement Fees, ','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(25,5,'including, but not limited to, those fees labeled as community reserve, asset preservation, capital reserve, working ','',1,'');


$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'21.','',0,'');
$pdf->Cell(100,5,'capital, community enhancement, future improvement fees, or payments. H.O.A. $','',0,'');
$pdf->Cell(25,5,$info['improvment_fees_hoa'],'B',0,'');
$pdf->Cell(30,5,'Master Association $','',0,'');
$pdf->Cell(25,5,$info['improvment_fees_homaster_app'],'B',1,'');
$pdf->Cell(200,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'22.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(40,5,"Prepaid Association(s) Fees:",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(123,5,"Dues, assessments, and any other association(s) fees paid in advance of their due date. H.O.A. $",'',0,'');
$pdf->Cell(18,5,$info['prepaid_fees_hoa'],'B',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'23.','',0,'');
$pdf->Cell(30,5,'Master Association $','',0,'');
$pdf->Cell(25,5,$info['prepaid_fees_homaster_app'],'B',1,'');
$pdf->Cell(200,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'24.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(25,5,"Disclosure Fees:",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"Association(s) Management/Company(ies) costs incurred in the preparation of a statement or other documents furnished",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'25.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"by the association(s) pursuant to the resale of the Premises for purposes of resale disclosure, lien estoppels and any other services related",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'26.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"to the transfer or use of the property. Pursuant to Arizona law, Disclosure Fees cannot be more than an aggregate of $400.00 per association.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'27.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"As part of the Disclosure Fees, each association may charge a statement or other documents update fee of no more than $50.00 if thirty (30)",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'28.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"days or more have passed since the date of the original disclosure statement or the date the documents were delivered. Additionally, each",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'29.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"association may charge a rush fee of no more than $100.00 if rush services are required to be performed within seventy-two (72) hours after",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'30.','',0,'');
$pdf->Cell(30,5,"the request. H.O.A. $ ",'',0,'');
$pdf->Cell(40,5,$info['disclosure_fees_hoa'],'B',0,'');
$pdf->Cell(30,5,"Master Association $ ",'',0,'');
$pdf->Cell(40,5,$info['disclosure_fees_homaster_app'],'B',1,'');
$pdf->Cell(200,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'31.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(25,5,"Other Fees: $ ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(40,5,$info['other_fees'],'B',0,'');
$pdf->Cell(15,5,"Explain ",'',0,'');
$pdf->Cell(90,5,$info['other_explain'],'B',1,'');
$pdf->Cell(200,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'32.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(35,5,"SELLER CERTIFICATION:",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"By signing below, Seller certifies that the information contained above is true and complete to the best of Seller's",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'33.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"actual knowledge as of the date signed. Broker(s) did not verify any of the information contained herein.",'',1,'');
$pdf->Cell(200,5,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,7,'34.','',0,'');
$pdf->Cell(40,7,$info['seller_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['seller_signiture_date'],'',0,'R');
$pdf->Cell(14,7,'','',0,'');
$pdf->Cell(40,7,$info['seller_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['seller_signiture_date'],'',1,'R');
$pdf->Cell(14,1,'','',0,'');
$pdf->Cell(80,1,'','T',0,'');
$pdf->Cell(14,1,'','',0,'');
$pdf->Cell(80,1,'','T',1,'');
$pdf->Cell(14,2,'35.','',0,'');
$pdf->SetFont('Arial','',6);
$pdf->Cell(40,2,"^ SELLER'S SIGNATURE",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
$pdf->Cell(14,2,'','',0,'');
$pdf->Cell(40,2,"^ SELLER'S SIGNATURE",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');
$pdf->Cell(200,5,'','',1,'');

// page no 2*/
$pdf->AddPage();

$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,5,'Page '.$pdf->PageNo().' of {nb}','',1,'R');
$pdf->Cell(0,5,'H.O.A. Condominium / Planned Community Addendum >>','',1,'L');
$pdf->Cell(0,7,'','T',1,'L');

$pdf->SetFont('Arial','B',10);
$pdf->Cell(205,4,"ADDITIONAL OBLIGATIONS",'',1,'C');

$pdf->SetLineWidth('1');
$pdf->SetDrawColor(0,0,0);
$pdf->Line(12,$pdf->GetY(),205,$pdf->GetY());
$pdf->SetLineWidth('');
$pdf->Ln(3);

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'36.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(75,5,"If the homeowner's association has less than 50 units,",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"no later than ten (10) days after Contract acceptance, the Seller shall provide in",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'37.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"writing to Buyer the information described below as required by Arizona law.",'',1,'');
$pdf->Cell(0,3,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'38.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(73,5,"If the homeowner's association has 50 or more units, ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"Seller shall furnish notice of pending sale that contains the name and address of the",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'39.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"Buyer to the homeowner's association within five (5) days after Contract acceptance and pursuant to Section 3d of the Contract. Escrow",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'40.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"Company is instructed to provide such notice on Seller's behalf. The association is obligated by Arizona law to provide information",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'41.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"described below to Buyer within ten (10) days after receipt of Seller's notice.",'',1,'');
$pdf->Cell(0,3,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'42.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,5,"BUYER IS ALLOWED FIVE (5) DAYS AFTER RECEIPT OF THE INFORMATION FROM THE SELLER(S) OR HOMEOWNER'S ASSOCIATION",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'43.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,5,"TO PROVIDE WRlTTEN NOTICE TO SELLER OF ANY ITEMS DISAPPROVED.",'',1,'');
$pdf->Cell(0,3,"",'',1,'');

// LINE
$pdf->Line(16,$pdf->GetY(),200,$pdf->GetY());
$pdf->Line(16,$pdf->GetY()+150,200,$pdf->GetY()+150);
$pdf->Line(16,$pdf->GetY(),16,$pdf->GetY()+150);
$pdf->Line(200,$pdf->GetY(),200,$pdf->GetY()+150);
// LINE
$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'44.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,5,"INFORMATION REQUIRED BY LAW TO BE PROVIDED TO BUYER:",'',1,'C');
$pdf->Cell(0,3,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'45.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"1. A copy of the bylaws and the rules of the association.",'',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'46.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,'2. A copy of the declaration of Covenants, Conditions and Restrictions ("CC&Rs").','',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'47.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"3. A dated statement containing:",'',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(15,5,'48.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"(a) The telephone number and address of a principal contact for the association, which may be an association manager, an association",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,5,'49.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"management company, an officer of the association or any other person designated by the board of directors.",'',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(15,5,'50.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"(b) The amount of the common expense assessment and the unpaid common expense assessment, special assessment or ",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,5,'51.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"other assessment, fee or charge currently due and payable from the Seller.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(15,5,'52.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"(c) A statement as to whether a portion of the unit is covered by insurance maintained by the association.",'',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(15,5,'53.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"(d) The total amount of money held by the association as reserves.",'',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(15,5,'54.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"(e) If the statement is being furnished by the association, a statement as to whether the records of the association reflect any",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,5,'55.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"alterations or improvements to the unit that violate the declaration. The association is not obligated to provide information",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,5,'56.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"regarding alterations or improvements that occurred more than six years before the proposed sale. Seller remains obligated",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,5,'57.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"to disclose alterations or improvements to the Premises that violate the declaration. The association may take action against",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,5,'58.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"the Buyer for violations apparent at the time of purchase that are not reflected in the association's records.",'',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(15,5,'59.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"(f) If the statement is being furnished by the Seller, a statement as to whether the Seller has any knowledge of any alterations",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,5,'60.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"or improvements to the unit that violate the declaration.",'',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(15,5,'61.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"(g) A statement of case names and case numbers for pending litigation with respect to the Premises or the association, including",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,5,'62.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"the amount of any money claimed.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'63.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"4. A copy of the current operating budget of the association.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'64.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"5. A copy of the most recent annual financial report of the association. If the report is more than ten pages, the association may provide",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'65.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"a summary of the report in lieu of the entire report.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'66.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"6. A copy of the most recent reserve study of the association, if any.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'67.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"7. Any other information required by law.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,5,'68.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,5,"8. A statement for Buyer acknowledgment and signature as required by Arizona law.",'',1,'');

$pdf->Cell(0,50,"",'',1,'');

// page no 3
$pdf->AddPage();

$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,5,'Page '.$pdf->PageNo().' of {nb}','',1,'R');
$pdf->Cell(0,5,'H.O.A. Condominium / Planned Community Addendum >>','',1,'L');
$pdf->Cell(0,7,'','T',1,'L');

$pdf->SetFont('Arial','B',10);
$pdf->Cell(205,4,"BUYER'S ACKNOWLEDGMENT AND TERMS",'',1,'C');

$pdf->SetLineWidth('1');
$pdf->SetDrawColor(0,0,0);
$pdf->Line(12,$pdf->GetY(),205,$pdf->GetY());
$pdf->SetLineWidth('');
$pdf->Ln(3);

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'69.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(10,4,"Buyer:  ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(178,4,$info['ack_buyer_name'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'70.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(10,4,"Seller:  ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(178,4,$info['ack_seller_name'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'71.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(25,4,"Premises Address:  ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(163,4,$info['ack_premises_address'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'72.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(10,4,"Date:  ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(178,4,$info['ack_date'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'73.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,4,"The following additional terms and conditions are hereby included as part of the Contract between Seller and Buyer for the",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'74.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,4,"above referenced Premises.",'',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'75.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(20,4,"Transfer Fees ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(45,4,"shall be paid by:  ",'',0,'');
$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->Cell(12,5,'Buyer','',0,'');
$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->Cell(12,5,'Seller','',0,'');
$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->Cell(10,5,'Other:','',0,'');
$pdf->Cell(30,5,$info['transfer_fees_other'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'76.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(37,4,"Capital Improvement Fees ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(30,4,"shall be paid by:  ",'',0,'');
$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->Cell(12,5,'Buyer','',0,'');
$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->Cell(12,5,'Seller','',0,'');
$pdf->Cell(3,5,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->Cell(10,5,'Other:','',0,'');
$pdf->Cell(30,5,$info['improvment_fees_other'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'77.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(26,4,"Buyer shall pay all ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"Prepaid Association Fees.",'',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'78.','',0,'');
$pdf->Cell(24,4,"Seller shall pay all ",'',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(24,4,"Disclosure Fees ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"as required by Arizona law.",'',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'79.','',0,'');
$pdf->Cell(0,4,"In a financed purchase, Buyer shall be responsible for all lender fees charged to obtain Association(s)/Management Company(ies) documents.",'',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'80.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(20,4,"Other fees:",'',0,'');
$pdf->Cell(160,4,$info['ack_other_fees'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'81.','',0,'');;
$pdf->Cell(180,4,'','B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'82.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(35,4,'BUYER VERIFICATION: ','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,'Buyer may contact the Association(s)/Management Company(ies) for verbal verification of association FEES','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'83.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,4,'PAYABLE UPON CLOSE OF ESCROW.','',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'84.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(25,4,'ASSESSMENTS:','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"Any current homeowner's association assessment which is a lien as of Close of Escrow shall be paid in full by Seller.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'85.','',0,'');
$pdf->Cell(0,4,"Any assessment that becomes a lien after Close of Escrow is Buyer's responsibility.",'',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'86.','',0,'');
$pdf->SetFont('Arial','B',10);
$pdf->Cell(180,4,"ADDITIONAL TERMS AND CONDITIONS",'',2,'L');
$pdf->Cell(0,2,"",'T',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'87.','',0,'');
$pdf->Cell(185,4,"",'B',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'88.','',0,'');
$pdf->Cell(185,4,"",'B',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'89.','',0,'');
$pdf->Cell(185,4,"",'B',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'90.','',0,'');
$pdf->Cell(185,4,"",'B',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'91.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(42,4,"BUYER ACKNOWLEDGMENT: ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"By signing below, Buyer acknowledges receipt of all three (3) pages of this addendum and acknowledges",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'92.','',0,'');
$pdf->Cell(0,4,"that although Seller has used best efforts to identify the amount of the fees stated herein, the precise amount of the fees may not be known",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'93.','',0,'');
$pdf->Cell(0,4,utf8_decode("until written disclosure documents are furnished by the Association(s)/Management Company(ies) per Arizona law (A.R.S. § 33-1260 and"),'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'94.','',0,'');
$pdf->Cell(0,4,utf8_decode("§ 33-1806). Buyer further acknowledges that Broker(s) did not verify any of the information contained therein. Buyer therefore agrees to hold"),'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'95.','',0,'');
$pdf->Cell(53,4,"Seller and Broker(s) harmless should the ",'',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(60,4,"FEES PAYABLE UPON CLOSE OF ESCROW ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"prove incorrect or incomplete.",'',1,'');

$pdf->Cell(0,4,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'96.','',0,'');
$pdf->Cell(0,4,"The undersigned agrees to the additional terms and conditions set forth above and acknowledges receipt of a copy hereof.",'',1,'');

$pdf->Cell(0,4,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,7,'97.','',0,'');
$pdf->Cell(40,7,$info['buyers_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['buyers_signiture_date'],'',0,'R');
$pdf->Cell(14,7,'','',0,'');
$pdf->Cell(40,7,$info['buyers_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['buyers_signiture_date'],'',1,'R');
$pdf->Cell(14,1,'','',0,'');
$pdf->Cell(80,1,'','T',0,'');
$pdf->Cell(14,1,'','',0,'');
$pdf->Cell(80,1,'','T',1,'');
$pdf->Cell(14,2,'98.','',0,'');
$pdf->SetFont('Arial','',6);
$pdf->Cell(40,2,"^ BUYER'S SIGNATURE ",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
$pdf->Cell(14,2,'','',0,'');
$pdf->Cell(40,2,"^ BUYER'S SIGNATURE ",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');
$pdf->Cell(200,5,'','',1,'');

$pdf->Cell(200,5,'','',1,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(8,7,"99.",'',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(0,7,"SELLER'S ACCEPTANCE:",'',0,'');
$pdf->Cell(200,5,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,7,'100.','',0,'');
$pdf->Cell(40,7,$info['seller_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['seller_signiture_date'],'',0,'R');
$pdf->Cell(14,7,'','',0,'');
$pdf->Cell(40,7,$info['seller_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['seller_signiture_date'],'',1,'R');
$pdf->Cell(14,1,'','',0,'');
$pdf->Cell(80,1,'','T',0,'');
$pdf->Cell(14,1,'','',0,'');
$pdf->Cell(80,1,'','T',1,'');
$pdf->Cell(14,2,'101.','',0,'');
$pdf->SetFont('Arial','',6);
$pdf->Cell(40,2,"^ SELLER'S SIGNATURE",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
$pdf->Cell(14,2,'','',0,'');
$pdf->Cell(40,2,"^ SELLER'S SIGNATURE",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');
$pdf->Cell(200,10,'','',1,'');


$pdf->Line(15,$pdf->GetY(),205,$pdf->GetY());
$pdf->Line(15,$pdf->GetY(),15,$pdf->GetY()+14);
$pdf->Line(205,$pdf->GetY(),205,$pdf->GetY()+14);
$pdf->Line(15,$pdf->GetY()+14,205,$pdf->GetY()+14);

$pdf->SetFont('Arial','B',8);	
$pdf->Cell(5,1,'','',0,''); 	// Broker use
$pdf->Cell(20,5,'For Broker Use Only:','',1,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(5,1,'','',0,'');
$pdf->Cell(30,5,'Brokerage File/Log No.','',0,'');
$pdf->Cell(20,5,$info['brokerage_file'],'B',0,'C');
$pdf->Cell(25,5,"Manager's Initials.",'',0,'');
$pdf->Cell(30,5,$info['managers_initials'],'B',0,'C');  
$pdf->Cell(25,5,"Broker's Initials.",'',0,'');
$pdf->Cell(30,5,$info['brokers_initials'],'B',0,'C');  
$pdf->Cell(10,5,"Date",'',0,'');
$pdf->Cell(20,5,$info['brokers_date'],'B',2,'C'); 
$pdf->Cell(20,5,'MO/DA/YR','T',1,'C');

$pdf->Output('','I');



?>