<?php
require('fpdf.php');
	//  Define variable
	global $info;
	$info=array();
	$info['seller_name']='Rabeya Sultana';
	$info['buyer_name']='Rezaul karim';
	$info['premises_address']='543 khilgaon ';
	$info['date']='22-07-2015';
	$info['term_and_condition']='cdc';
	$info['buyers_signiture']='Rabeya sultana rabu1';
	$info['buyers_signiture_date']='22-07-2015';
	$info['sellers_signiture']='Rabeya sultana rabu1 reza';
	$info['sellers_signiture_date']='23-07-2015';
	$info['brokerage_file']='52000';
	$info['managers_initials']='2000';
	$info['brokers_initials']='222';
	$info['brokers_date']='2-07-2015';
	
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
		$this->SetFont('Arial','B',9);
		$this->Cell(0,1,'Presidential Realty',0,1,'L');
		$this->SetFont('Arial','B',16);
		$this->Cell(100,12,'"AS IS" ADDENDUM',0,0,'L');
		$this->SetFont('Arial','',8);
		$this->SetX(180);
		$this->Cell(0,4,'Document updated:','L',0,'');
		$this->Ln();
		$this->SetX(180);
		$this->SetFont('Arial','B',8);
		$this->Cell(25,8,'February 2011','L',1,'C');
		
		$this->Cell(45,20,$this->Image('images/arizona_left.png',$this->GetX()+2, $this->GetY()+2,40,15),'1',0,'C');
		$this->SetFont('Arial','I',8);
		
		/* $this->CellFitScaleForce(130,3,'The pre-printed portion of this form has been drafted by the Arizona Association of REALTORS®. ','',2,'L');
		$this->CellFitScaleForce(130,3,'Any change in the pre-printed language of this form must be made in a prominent manner.','',2,'L');
		$this->CellFitScaleForce(130,3,'No representations are made as to the legal validity, adequacy and/or effects of any provision,','',2,'L');
		$this->CellFitScaleForce(130,3,'including tax consequences thereof. If you desire legal, tax or other professional advice, please ','',2,'L');
		$this->Cell(130,3,'consult your attorney, tax advisor or professional consultant.','',1,'L'); */

		$this->MultiCell(125,4,utf8_decode("The pre-printed portion of this form has been drafted by the Arizona Association of REALTORS®.\nAny change in the pre-printed language of this form must be made in a prominent manner.\nNo representations are made as to the legal validity, adequacy and/or effects of any provision,\nincluding tax consequences thereof. If you desire legal, tax or other professional advice, please \nconsult your attorney, tax advisor or professional consultant."),'1','J');
		
		$this->SetY(23);
		$this->SetX(180);
		$this->Cell(25,20,$this->Image('images/arizona_right.png',$this->GetX()+2, $this->GetY()+4,20,10),'1',0,'C');
    
}

// Page footer
function Footer()
{	
	global $info;
	$str1=utf8_decode('As Is" Addendum . Updated: February 2011 . Copyright © 2011 Arizona Association of REALTORS®. All rights reserved.');
	$str2=utf8_decode('Produced with zipForm® by zipLogix  18070 Fifteen Mile Road, Fraser, Michigan 48026');
	$this->Cell(25,5,'','',1,'');
	
	$this->Line(15,$this->GetY(),205,$this->GetY());
	$this->Line(15,$this->GetY(),15,$this->GetY()+14);
	$this->Line(205,$this->GetY(),205,$this->GetY()+14);
	
	$this->SetFont('Arial','B',10);	
	$this->Cell(5,1,'','',0,''); 	// Broker use
	$this->Cell(20,5,'For Broker Use Only:','',1,'');
	$this->SetFont('Arial','',10);
	$this->Cell(5,1,'','',0,'');
	$this->Cell(40,5,'Brokerage File/Log No.','',0,'');
	$this->Cell(20,5,$info['brokerage_file'],'B',0,'');
	$this->Cell(30,5,"Manager's Initials.",'',0,'');
	$this->Cell(20,5,$info['managers_initials'],'B',0,'');  
	$this->Cell(30,5,"Broker's Initials.",'',0,'');
	$this->Cell(20,5,$info['brokers_initials'],'B',0,'');  
	$this->Cell(10,5,"Date",'',0,'');
	$this->Cell(20,5,$info['brokers_date'],'B',2,''); 
	$this->SetFont('Arial','',8); 
	$this->Cell(20,5,'MO/DA/YR','T',1,'C');  
	
	$this->SetY($this->GetY()-2);
	$this->SetX($this->GetX()+5);
	$this->SetFont('Arial','',6);
	$this->Cell(7,1,'','B',0,''); 	
	$this->Cell(24,4,'(Added February 2012)','',0,'');  
	$this->Cell(159,1,'','B',1,'');  
	
	$this->Cell(180,3,'','B',1,'');  
	$this->SetFont('Arial','',8); 	
	$this->Cell(180,6,$str1,'',1,'C'); 
	$this->Cell(180,2,'','T',1,'');  
	$this->Cell(180,3,'Presidential Realty, 4856 E Baseline Rd #106 Mesa, AZ 85206','',1,'L'); 	
	$this->Cell(40,3,'Phone: 480-235-1400','',0,'');
	$this->Cell(20,3,'','',0,'');
	$this->Cell(30,3,"Fax: 480-212-5464",'',0,'');
	$this->Cell(20,3,'','',0,'');  
	$this->Cell(30,3,"Steve Peterson",'',1,'');
	
	$this->Image('images/footer_qr_code.png',$this->GetX()+182,$this->GetY()-14,15,0);
	$this->Ln();
	
	$this->SetY($this->GetY()-3);
	$this->SetX(60);
	$this->SetFont('Arial','',6);
	$this->Cell(70,3,$str2,0,0,'C');
	$this->SetX($this->GetX()+10);
	$this->SetFont('Arial','U',6);
	$this->Cell(15,5,' www.zipLogix.com',0,0,'','','https://zipLogix.com');
}

}

	$pdf = new PDF('P','mm',array(215,335));
	$pdf->AliasNbPages();
	$pdf->AddPage();
	$pdf->Ln();	
	
	$pdf->Cell(200,3,'','',1,'R');						
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(10,5,'1.','',0,'R');
	$pdf->SetFont('Arial','',10);					// seller
	$pdf->Cell(12,5,'Seller:','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(0,5,$info['seller_name'],'B',1,'');


	$pdf->SetFont('Arial','',0);
	$pdf->Cell(10,5,'2.','',0,'R');
	$pdf->SetFont('Arial','',10);					// Buyer
	$pdf->Cell(12,5,'Buyer:','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(0,5,$info['buyer_name'],'B',1,'');


	$pdf->SetFont('Arial','',10);
	$pdf->Cell(10,5,'3.','',0,'R');
	$pdf->SetFont('Arial','',10);					// Premises Address:
	$pdf->Cell(32,5,'Premises Address:','',0,'');
	$pdf->SetFont('Arial','',9);
	$pdf->Cell(0,5,$info['premises_address'],'B',1,'');


	$pdf->SetFont('Arial','',10);
	$pdf->Cell(10,5,'4.','',0,'R');
	$pdf->SetFont('Arial','',10);					// Date
	$pdf->Cell(10,5,'Date:','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(0,5,$info['date'],'B',1,'');
	
	$pdf->Cell(0,2,'','B',1,'');
	$pdf->Cell(0,2,'','',1,'');
	//text
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'5.','',0,'R');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpace(0,4,'The following additional terms and conditions are hereby included as a part of the Contract between Seller and Buyer for the','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'6.','',0,'R');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpace(0,4,'above referenced Premises. All terms and conditions of the Contract are hereby included herein and delivery of all notices','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'7.','',0,'R');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpace(0,4,'and documentation shall be deemed delivered and received when sent as required by Section 8m of the Contract.','',1,'');
	
	$pdf->Cell(0,2,'','',1,'');
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'8.','',0,'R');
	$pdf->SetFont('Arial','B',10);					
	$pdf->Cell(7,4,'A.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpace(0,4,'Seller and Buyer agree that the Premises is being sold in its existing condition ("AS IS") and Seller makes no warranty ','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'9.','',0,'R');
	$pdf->Cell(7,4,'','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpace(0,4,"to Buyer, either express or implied, as to the (1) condition of the Premises, including, but not limited to, Seller's Warranties",'',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'10.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpace(0,4,"in Lines 166-168 of Section 5a, which Buyer hereby waives; (2) zoning of the Premises; or (3) Premises' fitness for any",'',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'11.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpace(0,4,'particular use or purpose. However, Seller warrants and shall maintain and repair the Premises so that, pursuant to lines ','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'12.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpace(0,4,'169-170, at the earlier of possession or COE, the Premises, including all additional existing personal property included','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'13.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpace(0,4,'in the sale, will be in substantially the same condition as on the date of Contract acceptance and all personal property','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'14.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpace(0,4,'not included in the sale and all debris will be removed from the Premises.','',1,'');
	
	$pdf->Cell(0,2,'','',1,'');
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'15.','',0,'');
	$pdf->SetFont('Arial','B',10);					
	$pdf->Cell(7,4,'B.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,'Buyer is advised to conduct independent inspection(s) and investigations regarding the Premises within the','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'16.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,'Inspection Period as specified in Section 6a. Buyer retains the rights pursuant to Section 6j. Seller shall not ','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'17.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,"be obligated to correct any defects that may be discovered during Buyer's inspection(s) and ",'',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'18.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(0,4,'investigations or otherwise.','',1,'');
	
	$pdf->Cell(0,2,'','',1,'');
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'19.','',0,'');
	$pdf->SetFont('Arial','B',10);					
	$pdf->Cell(7,4,'C.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitScaleForce(0,4,'Notwithstanding the foregoing, if an On-Site Wastewater Treatment Facility (conventional septic or alternative ','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'20.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,'system) ("Facility") has been installed on the Premises, Seller and Buyer agree to complete and execute the AAR','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'21.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,'On-Site Wastewater Treatment Facility Addendum and Seller agrees to pay for the Facility inspections, fees or','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'22.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(0,4,'repairs as set forth therein.','',1,'');
	
	$pdf->Cell(0,2,'','',1,'');
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'23.','',0,'');
	$pdf->SetFont('Arial','B',10);					
	$pdf->Cell(7,4,'D.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,'Seller acknowledges that selling the Premises "AS IS" does not relieve Seller of the legal obligation to disclose all','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'24.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(0,4,'known material latent defects to Buyer.','',1,'');
	
	$pdf->Cell(0,2,'','',1,'');
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'25.','',0,'');
	$pdf->SetFont('Arial','B',10);					
	$pdf->Cell(7,4,'E.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,'In the event that any provision contained in this Addendum conflicts in whole or in part with any of the terms','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'26.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,'contained in the Contract, the provisions of this Addendum shall prevail and the conflicting terms are hereby','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'27.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(0,4,'considered deleted and expressly waived by both Buyer and Seller.','',1,'');
	
	$pdf->Cell(0,2,'','',1,'');
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'28.','',0,'');
	$pdf->SetFont('Arial','B',10);					
	$pdf->Cell(7,4,'F.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(0,4,'Other Terms and Conditions:','',1,'');
	
	$pdf->Cell(0,2,'','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'29.','',0,'');
	$pdf->Cell(0,4,'','B',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(14,4,'30.','',0,'');
	$pdf->Cell(0,4,'','B',1,'');
	
	$pdf->Cell(0,2,'','',1,'');
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'31.','',0,'');
	$pdf->SetFont('Arial','B',9);
	$pdf->CellFitSpaceForce(0,4,'BUYER  ACKNOWLEDGES  THAT  BUYER  IS  HEREBY  ADVISED  TO  SEEK  APPROPRIATE  COUNSEL  REGARDING','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'32.','',0,'');
	$pdf->SetFont('Arial','B',9);
	$pdf->Cell(0,4,'THE RISKS OF BUYING A PROPERTY IN "AS IS" CONDITION.','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'33.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,'Buyer recognizes, acknowledges, and agrees that Broker(s) are not qualified, nor licensed, to conduct due diligence with respect','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'34.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,"to the premises or the surrounding area. Buyer is instructed to consult with qualified licensed professionals to assist in Buyer's due",'',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'35.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,'diligence efforts. Because conducting due diligence with respect to the premises and the surrounding area is beyond the scope of','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'36.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,"the Broker's expertise and licensing, Buyer expressly releases and holds harmless Broker(s) from liability for any defects or conditions",'',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'37.','',0,'');
	$pdf->SetFont('Arial','',10);
	$pdf->CellFitSpaceForce(0,4,'that could have been discovered by inspection or investigation. Seller and Buyer hereby expressly release, hold harmless and','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'38.','',0,'');
	$pdf->SetFont('Arial','B',10);
	$pdf->CellFitSpaceForce(0,4,'indemnify Broker(s) In this transaction from any and all liability and responsibility regarding financing, the condition,','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'39.','',0,'');
	$pdf->SetFont('Arial','B',10);
	$pdf->CellFitSpaceForce(0,4,'square footage, lot lines, boundaries, values, rent rolls, environmental problems, sanitation systems, roof, wood infestation,','',1,'');

	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,4,'40.','',0,'');
	$pdf->SetFont('Arial','B',10);
	$pdf->CellFitSpaceForce(0,4,'building codes, governmental regulations, insurance or any other matter relating to the value or condition of the Premises. ','',1,'');
	$pdf->Cell(0,4,'','',1,'');
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,5,'41.','',0,'');
	$pdf->Cell(50,7,$info['buyers_signiture'],'',0,'L');
	$pdf->Cell(35,7,$info['buyers_signiture_date'],'',0,'R');
	$pdf->Cell(15,1,'','',0,'');
	$pdf->Cell(50,7,$info['buyers_signiture'],'',0,'L');
	$pdf->Cell(35,7,$info['buyers_signiture_date'],'',1,'R');
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(85,1,'','T',0,'');
	$pdf->Cell(15,1,'','',0,'');
	$pdf->Cell(85,1,'','T',1,'');
	$pdf->Cell(7,2,'','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(45,2,"^  BUYER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
	$pdf->Cell(15,2,'','',0,'');
	$pdf->Cell(45,2,"^  BUYER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');
	
	$pdf->Cell(0,4,'','',1,'');
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(7,5,'42.','',0,'');
	$pdf->Cell(50,7,$info['sellers_signiture'],'',0,'L');
	$pdf->Cell(35,7,$info['sellers_signiture_date'],'',0,'R');
	$pdf->Cell(15,1,'','',0,'');
	$pdf->Cell(50,7,$info['sellers_signiture'],'',0,'L');
	$pdf->Cell(35,7,$info['sellers_signiture_date'],'',1,'R');
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(85,1,'','T',0,'');
	$pdf->Cell(15,1,'','',0,'');
	$pdf->Cell(85,1,'','T',1,'');
	$pdf->Cell(7,2,'','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(45,2,"^  SELLER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
	$pdf->Cell(15,2,'','',0,'');
	$pdf->Cell(45,2,"^  SELLER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
	$pdf->Cell(0,3,'','',1,'');
	$pdf->Output('','I');
?>