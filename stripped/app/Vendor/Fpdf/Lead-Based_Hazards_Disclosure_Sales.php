<?php
require('fpdf.php');
	//  Define variable
	$info=array();
	$info['seller_name']='aaaa';
	$info['buyer_name']='bbb';
	$info['premises_address']='dhaka';
	$info['listing_agent']='rabeya1';
	$info['cooperatiing_agent']='rabeya2';
	$info['buyers_signiture']='rabeya1';
	$info['buyers_signiture_date']='20-12-2015';
	$info['seller_signiture']='aaa';
	$info['seller_signiture_date']='20-12-2015';
	$info['listing_agent_signiture']='vdffgdfg';
	$info['listing_agent_signiture_date']='20-12-2015';
	$info['cooperating_agent_signiture']='fefertf';
	$info['cooperating_agent_signiture_date']='20-12-2015';
	
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
		$this->SetFont('Arial','B',10);
		$this->Cell(0,1,'Presidential Realty',0,1,'L');
		$this->Ln(3);
		$this->SetFont('Arial','B',16);
		$this->Cell(100,7,'DISCLOSURE OF INFORMATION ON LEAD-BASED PAINT',0,0,'L');
		$this->Ln();
		$this->Cell(100,7,'AND LEAD-BASED PAINT HAZARDS (SALES)',0,0,'L');
		$this->SetFont('Arial','',7);
		$this->SetX(180);
		$this->Cell(0,4,'Document updated:','L',0,'');
		$this->Ln();
		$this->SetX(180);
		$this->SetFont('Arial','B',7);
		$this->Cell(0,3,'January 2009','L',1,'C');
		
		$this->Cell(40,20,$this->Image('images/arizona_left.png',$this->GetX()+2, $this->GetY()+2,35,15),'1',0,'C');
		$this->SetFont('Arial','I',8);
		$this->MultiCell(130,4,utf8_decode("The pre-printed portion of this form has been drafted by the Arizona Association of REALTORS®. Any \nchange  in  the pre-printed  language  of  this  form  must  be  made  in  a  prominent  manner.   No \nrepresentations are made as to the legal validity, adequacy and/or effects of any provision, including \ntax consequences thereof. If you desire legal, tax or other professional advice, please consult your \nattorney, tax advisor or professional consultant."),'1','J');
		$this->SetY(28);
		$this->SetX(180);
		$this->Cell(25,20,$this->Image('images/arizona_right.png',$this->GetX()+2, $this->GetY()+4,20,10),'1',1,'C');
    
}

// Page footer
function Footer()
{	
	global $info;
	$str1=utf8_decode('Disclosure of Information on Lead-Based Paint and Lead-Based Paint Hazards (Sales) . Updated: January 2009 . Copyright © 2009 Arizona Association of REALTORS®. All rights reserved. 	');
	$str2=utf8_decode('Produced with zipForm® by zipLogix  18070 Fifteen Mile Road, Fraser, Michigan 48026.');
	$this->Cell(25,5,'','',1,'');
	
	$this->Cell(182,1,'','B',1,'');  
	$this->SetFont('Arial','',6);	
	$this->Cell(182,5,$str1,'',1,'C'); 
	$this->Cell(182,1,'','T',1,''); 
	$this->Cell(100,5,'Presidential Realty, 4856 E Baseline Rd #106 Mesa, AZ 85206','',0,'L'); 	
	$this->Cell(40,5,'Phone: 480-235-1400','',0,'');
	$this->Cell(30,5,"Fax: 480-212-5464",'',1,'');
	$this->Cell(20,1,'','',1,'');  
	$this->Cell(30,4,"Steve Peterson",'',0,'');
	$this->Cell(85,4,$str2,0,0,'C');
	$this->Cell(30,4,' www.zipLogix.com',0,1,'','','https://zipLogix.com');
	
	$this->Image('images/footer_qr_code.png',$this->GetX()+185,$this->GetY()-20,15,0);
	$this->Ln();
	
}




}

$pdf = new PDF('P','mm',array(215,335));
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->Ln(3);	

//text
$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'1.','',0,'R');
$pdf->SetFont('Arial','',8);
$pdf->Cell(30,4,"Premises Address:  ",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(160,3,$info['premises_address'],'B',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'2.','',0,'R');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(35,4,"Lead Warning Statement:",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"Every buyer of any interest in residential real property on which a residential dwelling was built prior to 1978 is",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'3.','',0,'R');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"notified that such property may present exposure to lead from lead-based paint, which may place young children at risk of developing lead",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'4.','',0,'R');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"poisoning. Lead poisoning in young children may produce permanent neurological damage, including learning disabilities, reduced",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'5.','',0,'R');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"intelligence quotient, behavioral problems, and impaired memory. Lead poisoning also poses a particular risk to pregnant women.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'6.','',0,'R');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"The seller of any interest in residential real property is required to provide the buyer with any information on lead-based paint hazards from risk",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'7.','',0,'R');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"assessments or inspections in the seller's possession and to notify the buyer of any known lead-based paint hazards. A risk assessment or",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'8.','',0,'R');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"inspection for possible lead-based paint or lead-based paint hazards is recommended prior to purchase.",'',1,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(6,6,'','',0,'R');
$pdf->SetFont('Arial','B',11);
$pdf->Cell(50,6,"1.	SELLER'S DISCLOSURE",'B',0,'');
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,6," (Seller must complete and initial sections a, b and c below) ",'B',1,'');
$pdf->Cell(0,2,"",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'9.','',0,'R');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"(a) Lead-based paint and/or lead-based paint hazards (check either 1 or 2 below):",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(10,4,'10.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,"1. ",'',0,'');
$pdf->Cell(3,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->CellFitSpaceForce(0,4,"Seller is aware that lead-based paint and/or lead-based paint hazards are present in the residence(s) and/or building(s) included",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,4,'11.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(30,4,"in this sale. (Explain)",'',0,'');
$pdf->Cell(0,3,"",'B',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(10,4,'12.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,"2. ",'',0,'');
$pdf->Cell(3,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->CellFitSpaceForce(0,4,"Seller has no knowledge of any lead-based paint and/or lead-based paint hazards in the residence(s) and building(s) included",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,4,'13.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"in this sale.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'14.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(140,4,"(SELLER'S INITIALS REQUIRED)",'',0,'R');
$pdf->Cell(1,4,"",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(23,4,$info['seller_name'],'B',0,'C');
$pdf->Cell(3,4,"",'',0,'');
$pdf->Cell(23,4,$info['seller_name'],'B',1,'C');

$pdf->SetFont('Arial','',6);
$pdf->Cell(146,3,"",'',0,'R');
$pdf->Cell(23,3,"SELLER",'',0,'C');
$pdf->Cell(3,6,"",'',0,'');
$pdf->Cell(23,3,"SELLER",'',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'15.','',0,'');
$pdf->Cell(0,4,"(b)  Records and reports available to the seller (check either 1 or 2 below):",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(10,4,'16.','',0,'');
$pdf->Cell(5,4,"1. ",'',0,'');
$pdf->Cell(3,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"Seller has provided the buyer with all available records and reports relating to lead-based paint and/or lead-based paint hazards in",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,4,'17.','',0,'');
$pdf->Cell(88,4,"the residence(s) and building(s) included in the sale. (List documents)",'',0,'');
$pdf->Cell(0,4,"",'B',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(10,4,'18.','',0,'');
$pdf->Cell(5,4,"2. ",'',0,'');
$pdf->Cell(3,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->CellFitSpaceForce(0,4,"Seller has no reports or records relating to lead-based paint and/or lead-based paint hazards in the residence(s) and building(s)",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(18,4,'19.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"included in this sale.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'20.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(140,4,"(SELLER'S INITIALS REQUIRED)",'',0,'R');
$pdf->Cell(1,4,"",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(23,4,$info['seller_name'],'B',0,'C');
$pdf->Cell(3,4,"",'',0,'');
$pdf->Cell(23,4,$info['seller_name'],'B',1,'C');

$pdf->SetFont('Arial','',6);
$pdf->Cell(146,3,"",'',0,'R');
$pdf->Cell(23,3,"SELLER",'',0,'C');
$pdf->Cell(3,3,"",'',0,'');
$pdf->Cell(23,3,"SELLER",'',1,'C');


$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'21.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"(c) Seller acknowledges Seller's obligation to disclose to any real estate agent(s) to whom the seller directly or indirectly is to pay compensation",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'22.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"with regard to the transaction contemplated by this disclosure any known lead-based paint or lead-based paint hazards in the premises to be",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'23.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"sold, as well as the existence of any reports or records relating to lead-based paint or lead-based paint hazards in the premises to be sold.Seller",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'24.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"further acknowledges that this disclosure accurately reflects the entirety of the information provided by the seller to the agent(s) with regard to",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'25.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"lead-based paint, lead-based paint hazards, and lead-based paint risk-assessment or inspection reports and records.",'',1,'');
$pdf->Cell(0,2,'','',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'26.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(140,4,"(SELLER'S INITIALS REQUIRED)",'',0,'R');
$pdf->Cell(1,4,"",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(23,4,$info['seller_name'],'B',0,'C');
$pdf->Cell(3,4,"",'',0,'');
$pdf->Cell(23,4,$info['seller_name'],'B',1,'C');

$pdf->SetFont('Arial','',6);
$pdf->Cell(146,3,"",'',0,'R');
$pdf->Cell(23,3,"SELLER",'',0,'C');
$pdf->Cell(3,3,"",'',0,'');
$pdf->Cell(23,3,"SELLER",'',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'','',0,'');
$pdf->SetFont('Arial','B',11);
$pdf->Cell(65,4,"2.   BUYER'S ACKNOWLEDGMENT ",'',0,'');
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,4,"(Buyer must complete and initial sections a, b and c below) ",'',1,'');
$pdf->Cell(8,1,"",'',0,'');
$pdf->Cell(188,1,"",'B',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'27.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"(a) Buyer has read the information set forth above, and has received copies of the reports, records, or other materials listed above, if any.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'28','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(140,4,"(BUYER'S INITIALS REQUIRED)",'',0,'R');
$pdf->Cell(1,4,"",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(23,4,$info['buyer_name'],'B',0,'C');
$pdf->Cell(3,4,"",'',0,'');
$pdf->Cell(23,4,$info['buyer_name'],'B',1,'C');

$pdf->SetFont('Arial','',6);
$pdf->Cell(146,2,"",'',0,'R');
$pdf->Cell(23,2,"BUYER",'',0,'C');
$pdf->Cell(3,2,"",'',0,'');
$pdf->Cell(23,2,"BUYER",'',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,3,'29.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(47,3,"(b) Buyer has received the pamphlet ",'',0,'');
$pdf->SetFont('Arial','I',8);
$pdf->Cell(0,3,"Protect Your Family From Lead in Your Home.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'30','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(140,4,"(BUYER'S INITIALS REQUIRED)",'',0,'R');
$pdf->Cell(1,4,"",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(23,4,$info['buyer_name'],'B',0,'C');
$pdf->Cell(3,4,"",'',0,'');
$pdf->Cell(23,4,$info['buyer_name'],'B',1,'C');

$pdf->SetFont('Arial','',6);
$pdf->Cell(146,3,"",'',0,'R');
$pdf->Cell(23,3,"BUYER",'',0,'C');
$pdf->Cell(1,3,"",'',0,'');
$pdf->Cell(23,3,"BUYER",'',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(6,4,'31.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"(c) Buyer has (check one):",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(15,4,'32.','',0,'');
$pdf->Cell(3,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"Received a 10-day opportunity (or mutually agreed upon period) to conduct a risk assessment or inspection for the",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(21,4,'33.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"presence of lead-based paint and/or lead-based paint hazards; or",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(15,4,'34.','',0,'');
$pdf->Cell(3,4,$pdf->Rect($pdf->GetX(),$pdf->GetY()+1,3,3),'',0,'');
$pdf->CellFitSpaceForce(0,4,"Waived the opportunity to conduct a risk assessment or inspection for the presence of lead-based paint and/or",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(21,4,'35.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"lead-based paint hazards.",'',1,'');


$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'36.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(140,4,"(BUYER'S  INITIALS REQUIRED)",'',0,'R');
$pdf->Cell(1,4,"",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(23,4,$info['buyer_name'],'B',0,'C');
$pdf->Cell(3,4,"",'',0,'');
$pdf->Cell(23,4,$info['buyer_name'],'B',1,'C');

$pdf->SetFont('Arial','',6);
$pdf->Cell(146,3,"",'',0,'R');
$pdf->Cell(23,3,"BUYER",'',0,'C');
$pdf->Cell(3,3,"",'',0,'');
$pdf->Cell(23,3,"BUYER",'',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(8,4,'','',0,'');
$pdf->SetFont('Arial','B',11);
$pdf->Cell(65,4,"3.  AGENT'S  ACKNOWLEDGMENT   ",'',0,'');
$pdf->SetFont('Arial','B',9);
$pdf->CellFitSpaceForce(0,4,"(Any real estate agent who is to receive compensation from the seller or the listing ",'',1,'');
$pdf->Cell(8,4,"",'',0,'');
$pdf->Cell(0,4,"agent with regard to the transaction contemplated in this disclosure must initial below.) ",'',1,'');
$pdf->Cell(8,2,"",'',0,'');
$pdf->Cell(188,2,"",'T',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'37.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"The agent(s) whose initials appear below has (have) ensured the seller's compliance under the Residential Resale Lead-Based Paint Hazard",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'38.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"Reduction Act of 1992 by the seller's use and completion of this disclosure form.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'39.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(140,4,"(AGENT'S INITIALS REQUIRED)",'',0,'R');
$pdf->Cell(1,4,"",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(23,4,$info['listing_agent'],'B',0,'C');
$pdf->Cell(3,4,"",'',0,'');
$pdf->Cell(23,4,$info['cooperatiing_agent'],'B',1,'C');

$pdf->SetFont('Arial','',6);
$pdf->Cell(146,3,"",'',0,'R');
$pdf->Cell(23,3,"LISTING AGENT",'',0,'C');
$pdf->Cell(3,3,"",'',0,'');
$pdf->Cell(23,3,"COOPERATING AGENT",'',1,'C');

$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'40.','',0,'');
$pdf->SetFont('Arial','B',8);
$pdf->Cell(35,4,"Certification of Accuracy:",'',0,'');
$pdf->SetFont('Arial','',8);
$pdf->CellFitSpaceForce(0,4,"By signing below, each signatory acknowledges that he or she has reviewed the above information, and",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(5,4,'41.','',0,'');
$pdf->SetFont('Arial','',8);
$pdf->Cell(0,4,"certifies that, to the best of his or her knowledge, the information provided by the signatory is true and accurate.",'',1,'');

$pdf->SetFont('Arial','',8);
$pdf->Cell(7,5,'42.','',0,'');
$pdf->Cell(50,7,$info['seller_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['seller_signiture_date'],'',0,'R');
$pdf->Cell(10,7,'','',0,'');
$pdf->Cell(50,7,$info['buyers_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['buyers_signiture_date'],'',1,'R');
$pdf->Cell(7,1,'','',0,'');
$pdf->Cell(90,1,'','T',0,'');
$pdf->Cell(10,1,'','',0,'');
$pdf->Cell(90,1,'','T',1,'');
$pdf->Cell(7,2,'','',0,'');
$pdf->SetFont('Arial','',6);
$pdf->Cell(50,2,"^  SELLER'S SIGNATURE",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
$pdf->Cell(10,2,'','',0,'');
$pdf->Cell(50,2,"^  BUYER'S SIGNATURE",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');

$pdf->SetFont('Arial','',8);
$pdf->Cell(7,5,'43.','',0,'');
$pdf->Cell(50,7,$info['seller_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['seller_signiture_date'],'',0,'R');
$pdf->Cell(10,7,'','',0,'');
$pdf->Cell(50,7,$info['buyers_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['buyers_signiture_date'],'',1,'R');
$pdf->Cell(7,1,'','',0,'');
$pdf->Cell(90,1,'','T',0,'');
$pdf->Cell(10,1,'','',0,'');
$pdf->Cell(90,1,'','T',1,'');
$pdf->Cell(7,2,'','',0,'');
$pdf->SetFont('Arial','',6);
$pdf->Cell(50,2,"^  SELLER'S SIGNATURE",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
$pdf->Cell(10,2,'','',0,'');
$pdf->Cell(50,2,"^  BUYER'S SIGNATURE",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');

$pdf->SetFont('Arial','',8);
$pdf->Cell(7,5,'44.','',0,'');
$pdf->Cell(50,7,$info['listing_agent_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['listing_agent_signiture_date'],'',0,'R');
$pdf->Cell(10,7,'','',0,'');
$pdf->Cell(50,7,$info['cooperating_agent_signiture'],'',0,'L');
$pdf->Cell(40,7,$info['cooperating_agent_signiture_date'],'',1,'R');
$pdf->Cell(7,1,'','',0,'');
$pdf->Cell(90,1,'','T',0,'');
$pdf->Cell(10,1,'','',0,'');
$pdf->Cell(90,1,'','T',1,'');
$pdf->Cell(7,2,'','',0,'');
$pdf->SetFont('Arial','',6);
$pdf->Cell(50,2,"^  LISTING AGENT'S SIGNATURE",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
$pdf->Cell(10,2,'','',0,'');
$pdf->Cell(50,2,"^  COOPERATING AGENT'S SIGNATURE",'',0,'L');
$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');

$pdf->Output('','I');



?>